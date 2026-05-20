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
async def test_trash_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # 1. Create entry
        await ac.post("/entries", json={"titulo": "Note 1", "contenido": "C1", "type": "note"}, headers=headers)
        
        # 2. Verify it's in list_entries
        resp = await ac.get("/entries", headers=headers)
        assert len(resp.json()) == 1
        entry_id = resp.json()[0]["id"]
        
        # 3. Trash it
        resp = await ac.post(f"/entries/{entry_id}/trash", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["is_deleted"] is True
        
        # 4. Verify it's NOT in list_entries
        resp = await ac.get("/entries", headers=headers)
        assert len(resp.json()) == 0
        
        # 5. Verify it IS in list_trash
        resp = await ac.get("/entries/trash", headers=headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["id"] == entry_id
        
        # 6. Restore it
        resp = await ac.post(f"/entries/{entry_id}/restore", headers=headers)
        assert resp.status_code == 200
        assert resp.json()["is_deleted"] is False
        
        # 7. Verify it's back in list_entries
        resp = await ac.get("/entries", headers=headers)
        assert len(resp.json()) == 1
        
        # 8. Trash it again for deletion test
        await ac.post(f"/entries/{entry_id}/trash", headers=headers)
        
        # 9. Try to delete it (Permanent)
        resp = await ac.delete(f"/entries/{entry_id}", headers=headers)
        assert resp.status_code == 204
        
        # 10. Verify it's gone from both
        resp = await ac.get("/entries", headers=headers)
        assert len(resp.json()) == 0
        resp = await ac.get("/entries/trash", headers=headers)
        assert len(resp.json()) == 0

@pytest.mark.asyncio
async def test_permanent_delete_restriction():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # 1. Create entry
        await ac.post("/entries", json={"titulo": "Note 1", "contenido": "C1", "type": "note"}, headers=headers)
        resp = await ac.get("/entries", headers=headers)
        entry_id = resp.json()[0]["id"]
        
        # 2. Try to permanent delete without trashing first
        resp = await ac.delete(f"/entries/{entry_id}", headers=headers)
        assert resp.status_code == 400
        assert "Solo se pueden eliminar permanentemente elementos de la papelera" in resp.json()["detail"]
