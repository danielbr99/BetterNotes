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

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/auth/register", 
            json={"email": "test@example.com", "password": "password123"}
        )
    assert response.status_code == 201
    assert response.json() == {"message": "Usuario registrado con éxito"}

@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Register first
        await ac.post(
            "/auth/register", 
            json={"email": "test@example.com", "password": "password123"}
        )
        # Login
        response = await ac.post(
            "/auth/token", 
            data={"username": "test@example.com", "password": "password123"}
        )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/auth/token", 
            data={"username": "wrong@example.com", "password": "wrongpassword"}
        )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_unauthorized_access():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/notas")
    assert response.status_code == 401
