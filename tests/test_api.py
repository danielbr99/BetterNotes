import pytest
from httpx import AsyncClient, ASGITransport
from src.app import app
from src.database import engine, Base

@pytest.fixture(autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

async def get_auth_header(ac: AsyncClient, email: str, password: str):
    await ac.post("/auth/register", json={"email": email, "password": password})
    response = await ac.post("/auth/token", data={"username": email, "password": password})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_create_note():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        response = await ac.post(
            "/notas", 
            json={"titulo": "Test Note", "contenido": "Test Content"},
            headers=headers
        )
    
    assert response.status_code == 201
    assert response.json() == {"message": "Nota creada con éxito."}

@pytest.mark.asyncio
async def test_list_notes_ownership():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # User 1 creates a note
        h1 = await get_auth_header(ac, "u1@example.com", "p1")
        await ac.post("/notas", json={"titulo": "N1", "contenido": "C1"}, headers=h1)
        
        # User 2 creates a note
        h2 = await get_auth_header(ac, "u2@example.com", "p2")
        await ac.post("/notas", json={"titulo": "N2", "contenido": "C2"}, headers=h2)
        
        # User 1 should ONLY see N1
        response = await ac.get("/notas", headers=h1)
        notes = response.json()
        assert len(notes) == 1
        assert notes[0]["titulo"] == "N1"

@pytest.mark.asyncio
async def test_get_note_not_found_or_not_owned():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        h1 = await get_auth_header(ac, "u1@example.com", "p1")
        await ac.post("/notas", json={"titulo": "N1", "contenido": "C1"}, headers=h1)
        
        h2 = await get_auth_header(ac, "u2@example.com", "p2")
        # User 2 tries to get User 1's note (ID 1)
        response = await ac.get("/notas/1", headers=h2)
    
    assert response.status_code == 404
