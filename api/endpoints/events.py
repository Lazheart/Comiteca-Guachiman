from fastapi import APIRouter, Depends, Query
from typing import Optional
from core.config import get_db_connection
from repositories.events import EventRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("")
def get_events(
    date: Optional[str] = None,
    date_from: Optional[str] = Query(None, alias="from"),
    to: Optional[str] = None,
    pagination: dict = Depends(get_pagination_params),
    conn: Connection = Depends(get_db_connection)
):
    repo = EventRepository(conn)
    return repo.get_all(date, date_from, to, **pagination)

@router.get("/upcoming")
def get_upcoming_events(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = EventRepository(conn)
    return repo.get_upcoming(**pagination)

@router.get("/{event_id}")
def get_event(event_id: int, conn: Connection = Depends(get_db_connection)):
    repo = EventRepository(conn)
    return repo.get_by_id(event_id)
