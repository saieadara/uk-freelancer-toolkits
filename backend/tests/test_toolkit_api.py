"""API regression tests for UK Freelancer Toolkit public endpoints."""

import os
import uuid

import pytest
import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")


@pytest.fixture(scope="session")
def api_base_url():
    """Resolve externally visible API base URL from env."""
    if not BASE_URL:
        pytest.skip("REACT_APP_BACKEND_URL is not set")
    return BASE_URL.rstrip("/")


@pytest.fixture
def api_client():
    """Shared HTTP client fixture."""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    yield session
    session.close()


# Core service health and baseline checks
def test_root_endpoint_returns_hello_world(api_client, api_base_url):
    response = api_client.get(f"{api_base_url}/api/")
    assert response.status_code == 200
    payload = response.json()
    assert payload == {"message": "Hello World"}


# Status module create/read persistence checks
def test_status_create_and_get_persists_record(api_client, api_base_url):
    unique_name = f"TEST_CLIENT_{uuid.uuid4().hex[:8]}"
    create_response = api_client.post(
        f"{api_base_url}/api/status",
        json={"client_name": unique_name},
    )
    assert create_response.status_code == 200
    created = create_response.json()
    assert isinstance(created.get("id"), str) and created["id"]
    assert created["client_name"] == unique_name
    assert isinstance(created.get("timestamp"), str)

    list_response = api_client.get(f"{api_base_url}/api/status")
    assert list_response.status_code == 200
    rows = list_response.json()
    assert isinstance(rows, list)
    matched = [item for item in rows if item.get("id") == created["id"]]
    assert len(matched) == 1
    assert matched[0]["client_name"] == unique_name


# Waitlist module validation and retrieval checks
def test_waitlist_rejects_invalid_email(api_client, api_base_url):
    response = api_client.post(
        f"{api_base_url}/api/waitlist",
        json={"email": "invalid-email", "source": "pytest-invalid"},
    )
    assert response.status_code == 422
    payload = response.json()
    assert "detail" in payload


def test_waitlist_create_and_get_by_id(api_client, api_base_url):
    unique_email = f"pytest_{uuid.uuid4().hex[:8]}@example.co.uk"
    source = "pytest-suite"

    create_response = api_client.post(
        f"{api_base_url}/api/waitlist",
        json={"email": unique_email, "source": source},
    )
    assert create_response.status_code == 200
    created = create_response.json()
    assert isinstance(created.get("id"), str) and created["id"]
    assert created["email"] == unique_email
    assert created["source"] == source
    assert isinstance(created.get("created_at"), str)

    get_response = api_client.get(f"{api_base_url}/api/waitlist/{created['id']}")
    assert get_response.status_code == 200
    fetched = get_response.json()
    assert fetched["id"] == created["id"]
    assert fetched["email"] == unique_email
    assert fetched["source"] == source


def test_waitlist_duplicate_email_same_source_returns_existing(api_client, api_base_url):
    duplicate_email = f"pytest_dup_{uuid.uuid4().hex[:8]}@example.co.uk"
    source = "pytest-duplicate"

    first = api_client.post(
        f"{api_base_url}/api/waitlist",
        json={"email": duplicate_email, "source": source},
    )
    assert first.status_code == 200
    first_payload = first.json()

    second = api_client.post(
        f"{api_base_url}/api/waitlist",
        json={"email": duplicate_email.upper(), "source": source},
    )
    assert second.status_code == 200
    second_payload = second.json()
    assert second_payload["id"] == first_payload["id"]
    assert second_payload["email"] == duplicate_email
    assert second_payload["source"] == source


def test_waitlist_get_missing_record_returns_404(api_client, api_base_url):
    random_id = str(uuid.uuid4())
    response = api_client.get(f"{api_base_url}/api/waitlist/{random_id}")
    assert response.status_code == 404
    payload = response.json()
    assert payload.get("detail") == "Interest record not found"
