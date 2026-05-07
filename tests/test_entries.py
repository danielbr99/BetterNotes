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
    reg_resp = await ac.post("/auth/register", json={"email": email, "password": password})
    response = await ac.post("/auth/token", data={"username": email, "password": password})
    if response.status_code != 200:
        raise Exception(f"Login failed: {response.text}")
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_create_note_entry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        response = await ac.post(
            "/entries", 
            json={
                "titulo": "Test Note", 
                "contenido": "Test Content",
                "type": "note"
            },
            headers=headers
        )
    
    assert response.status_code == 201
    assert response.json()["message"] == "Note creada con éxito."

@pytest.mark.asyncio
async def test_create_task_entry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        response = await ac.post(
            "/entries", 
            json={
                "titulo": "Test Task", 
                "contenido": "Do this",
                "type": "task",
                "priority": "high",
                "status_column": "todo"
            },
            headers=headers
        )
    
    assert response.status_code == 201
    assert response.json() == {"message": "Task creada con éxito."}

@pytest.mark.asyncio
async def test_list_entries_mixed_types():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        # Create a note
        await ac.post("/entries", json={"titulo": "N1", "contenido": "C1", "type": "note"}, headers=headers)
        # Create a task
        await ac.post("/entries", json={"titulo": "T1", "contenido": "C2", "type": "task", "priority": "medium"}, headers=headers)
        
        response = await ac.get("/entries", headers=headers)
        entries = response.json()
        assert len(entries) == 2
        
        # Verify types and polymorphic data
        note = next(e for e in entries if e["type"] == "note")
        task = next(e for e in entries if e["type"] == "task")
        
        assert note["titulo"] == "N1"
        assert task["titulo"] == "T1"
        assert task["priority"] == "medium"
        assert note.get("priority") is None

@pytest.mark.asyncio
async def test_get_entry_by_id():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "N1", "contenido": "C1", "type": "note"}, headers=headers)
        
        response = await ac.get("/entries/1", headers=headers)
        assert response.status_code == 200
        assert response.json()["titulo"] == "N1"

@pytest.mark.asyncio
async def test_upload_and_get_asset():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Upload
        files = {'file': ('test.txt', b'hello world', 'text/plain')}
        up_resp = await ac.post("/assets", files=files, headers=headers)
        assert up_resp.status_code == 201
        asset_id = up_resp.json()["id"]
        
        # Get
        get_resp = await ac.get(f"/assets/{asset_id}", headers=headers)
        assert get_resp.status_code == 200
        assert get_resp.content == b'hello world'

@pytest.mark.asyncio
async def test_delete_asset():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Upload
        files = {'file': ('delete_me.txt', b'bye bye', 'text/plain')}
        up_resp = await ac.post("/assets", files=files, headers=headers)
        asset_id = up_resp.json()["id"]
        
        # Delete
        del_resp = await ac.delete(f"/assets/{asset_id}", headers=headers)
        assert del_resp.status_code == 204
        
        # Verify gone from DB/API
        get_resp = await ac.get(f"/assets/{asset_id}", headers=headers)
        assert get_resp.status_code == 404

@pytest.mark.asyncio
async def test_kanban_columns():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create
        resp = await ac.post("/columns", json={"name": "To Do", "position": 1}, headers=headers)
        assert resp.status_code == 201
        col_id = resp.json()["id"]
        
        # List
        resp = await ac.get("/columns", headers=headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["name"] == "To Do"
        
        # Delete
        resp = await ac.delete(f"/columns/{col_id}", headers=headers)
        assert resp.status_code == 204
        
        # List again
        resp = await ac.get("/columns", headers=headers)
        assert len(resp.json()) == 0

@pytest.mark.asyncio
async def test_filter_entries_by_type():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "N1", "contenido": "C1", "type": "note"}, headers=headers)
        await ac.post("/entries", json={"titulo": "T1", "contenido": "C2", "type": "task"}, headers=headers)
        
        # Filter for tasks
        resp = await ac.get("/entries?type=task", headers=headers)
        entries = resp.json()
        assert len(entries) == 1
        assert entries[0]["type"] == "task"

@pytest.mark.asyncio
async def test_filter_entries_by_kanban_status():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "T1", "contenido": "C1", "type": "task", "status_column": "todo"}, headers=headers)
        await ac.post("/entries", json={"titulo": "T2", "contenido": "C2", "type": "task", "status_column": "done"}, headers=headers)
        
        # Filter for 'done'
        resp = await ac.get("/entries?status_column=done", headers=headers)
        entries = resp.json()
        assert len(entries) == 1
        assert entries[0]["status_column"] == "done"

@pytest.mark.asyncio
async def test_sort_entries_by_title():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "B", "contenido": "C1", "type": "note"}, headers=headers)
        await ac.post("/entries", json={"titulo": "A", "contenido": "C2", "type": "note"}, headers=headers)
        
        # Sort by title ASC
        resp = await ac.get("/entries?sort_by=titulo&order=asc", headers=headers)
        entries = resp.json()
        assert entries[0]["titulo"] == "A"
        assert entries[1]["titulo"] == "B"

@pytest.mark.asyncio
async def test_create_encrypted_entry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Simulating client-side encryption: content is a blob, metadata has IV/Salt
        encrypted_blob = "U2FsdGVkX1+vS6562H96OhS8oK9/E96A=="
        metadata = '{"iv": "123", "salt": "456", "alg": "AES-256"}'
        
        resp = await ac.post("/entries", json={
            "titulo": "Secret Note",
            "contenido": encrypted_blob,
            "type": "note",
            "is_encrypted": True,
            "encryption_metadata": metadata
        }, headers=headers)
        
        assert resp.status_code == 201
        
        # Fetch and verify
        resp = await ac.get("/entries/1", headers=headers)
        data = resp.json()
        assert data["is_encrypted"] is True
        assert data["contenido"] == encrypted_blob
        assert data["encryption_metadata"] == metadata

@pytest.mark.asyncio
async def test_filter_entries_by_encryption():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "Encrypted", "contenido": "...", "type": "note", "is_encrypted": True}, headers=headers)
        await ac.post("/entries", json={"titulo": "Plain", "contenido": "...", "type": "note", "is_encrypted": False}, headers=headers)
        
        # Filter for encrypted only
        resp = await ac.get("/entries?is_encrypted=true", headers=headers)
        entries = resp.json()
        assert len(entries) == 1
        assert entries[0]["is_encrypted"] is True

@pytest.mark.asyncio
async def test_entry_versioning():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "V1", "contenido": "C1", "type": "note"}, headers=headers)
        
        # Initial version
        resp = await ac.get("/entries/1", headers=headers)
        assert resp.json()["version"] == 1
        
        # Update
        await ac.patch("/entries/1", json={"titulo": "V2"}, headers=headers)
        resp = await ac.get("/entries/1", headers=headers)
        assert resp.json()["version"] == 2

@pytest.mark.asyncio
async def test_asset_linking_to_entry():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        # Create entry
        await ac.post("/entries", json={"titulo": "E1", "contenido": "C1", "type": "note"}, headers=headers)
        
        # Upload asset with entry_id
        files = {'file': ('img.png', b'data', 'image/png')}
        resp = await ac.post("/assets?entry_id=1", files=files, headers=headers)
        assert resp.status_code == 201
        assert resp.json()["entry_id"] == 1

@pytest.mark.asyncio
async def test_update_task_movement():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create Task
        await ac.post("/entries", json={
            "titulo": "Move Me", 
            "contenido": "C", 
            "type": "task",
            "status_column": "todo"
        }, headers=headers)
        
        # Update/Move
        resp = await ac.patch("/entries/1", json={"status_column": "done", "priority": "high"}, headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["status_column"] == "done"
        assert data["priority"] == "high"

@pytest.mark.asyncio
async def test_update_note_no_kanban_metadata():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create Note
        await ac.post("/entries", json={"titulo": "Note", "contenido": "C", "type": "note"}, headers=headers)
        
        # Try to add Kanban metadata to Note (Should fail)
        resp = await ac.patch("/entries/1", json={"priority": "high"}, headers=headers)
        assert resp.status_code == 400
        assert "Notes cannot have Kanban metadata" in resp.json()["detail"]

@pytest.mark.asyncio
async def test_folders_hierarchy():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create Parent Folder
        resp = await ac.post("/folders", json={"name": "Work"}, headers=headers)
        parent_id = resp.json()["id"]
        
        # Create Subfolder
        resp = await ac.post("/folders", json={"name": "Project X", "parent_id": parent_id}, headers=headers)
        assert resp.status_code == 201
        assert resp.json()["parent_id"] == parent_id
        
        # List folders
        resp = await ac.get("/folders", headers=headers)
        assert len(resp.json()) == 2

@pytest.mark.asyncio
async def test_multi_tag_assignment():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create entry with tags
        await ac.post("/entries", json={
            "titulo": "Tagged", 
            "contenido": "...", 
            "type": "note",
            "tags": ["urgent", "review"]
        }, headers=headers)
        
        resp = await ac.get("/entries/1", headers=headers)
        assert resp.json()["tags"] == ["urgent", "review"]
        
        # Update tags
        await ac.patch("/entries/1", json={"tags": ["completed"]}, headers=headers)
        resp = await ac.get("/entries/1", headers=headers)
        assert resp.json()["tags"] == ["completed"]

@pytest.mark.asyncio
async def test_cascading_encryption_from_folder():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # Create Encrypted Folder
        metadata = '{"folder_key": "xyz"}'
        resp = await ac.post("/folders", json={
            "name": "Secret Vault", 
            "is_encrypted": True,
            "encryption_metadata": metadata
        }, headers=headers)
        folder_id = resp.json()["id"]
        
        # Create Entry in that folder (without specifying encryption)
        await ac.post("/entries", json={
            "titulo": "Inherited Secret", 
            "contenido": "Encrypted Content", 
            "type": "note",
            "folder_id": folder_id
        }, headers=headers)
        
        # Verify it inherited encryption status and metadata
        resp = await ac.get("/entries/1", headers=headers)
        data = resp.json()
        assert data["is_encrypted"] is True
        assert data["encryption_metadata"] == metadata

@pytest.mark.asyncio
async def test_keyword_search():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        await ac.post("/entries", json={"titulo": "Buying Milk", "contenido": "Eggs and bread", "type": "note"}, headers=headers)
        await ac.post("/entries", json={"titulo": "Work Report", "contenido": "Deadline is Friday", "type": "note"}, headers=headers)
        
        # Search in title
        resp = await ac.get("/entries?q=Milk", headers=headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["titulo"] == "Buying Milk"
        
        # Search in content
        resp = await ac.get("/entries?q=Friday", headers=headers)
        assert len(resp.json()) == 1
        assert resp.json()[0]["titulo"] == "Work Report"

@pytest.mark.asyncio
async def test_automatic_asset_cleanup_on_entry_deletion():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        
        # 1. Create Entry
        await ac.post("/entries", json={"titulo": "E1", "contenido": "C1", "type": "note"}, headers=headers)
        
        # 2. Upload Asset linked to Entry
        files = {'file': ('cleanup.txt', b'delete me', 'text/plain')}
        up_resp = await ac.post("/assets?entry_id=1", files=files, headers=headers)
        asset_id = up_resp.json()["id"]
        
        # 3. Verify file exists
        from src.app import ASSETS_DIR
        import os
        found = False
        for f in os.listdir(ASSETS_DIR):
            if f.startswith(asset_id):
                found = True
                break
        assert found is True
        
        # 4. Delete Entry (should trigger asset deletion via cascade + listener)
        del_resp = await ac.delete("/entries/1", headers=headers)
        assert del_resp.status_code == 204
        
        # 5. Verify file is gone from disk
        found = False
        if os.path.exists(ASSETS_DIR):
            for f in os.listdir(ASSETS_DIR):
                if f.startswith(asset_id):
                    found = True
                    break
        assert found is False

@pytest.mark.asyncio
async def test_task_is_completed():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        headers = await get_auth_header(ac, "user@example.com", "pass")
        # Create a task with is_completed=True
        resp = await ac.post("/entries", json={
            "titulo": "Done Task", 
            "contenido": "C1", 
            "type": "task", 
            "is_completed": True
        }, headers=headers)
        assert resp.status_code == 201
        
        # Get entries filtered by is_completed
        resp = await ac.get("/entries?is_completed=true", headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) == 1
        assert data[0]["titulo"] == "Done Task"
        assert data[0]["is_completed"] is True

        # Toggle is_completed
        entry_id = data[0]["id"]
        resp = await ac.patch(f"/entries/{entry_id}", json={"is_completed": False}, headers=headers)
        assert resp.status_code == 200
        assert resp.json()["is_completed"] is False
