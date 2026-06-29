from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.statistics import StatisticsRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("/most-loaned-materials")
def get_most_loaned_materials(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_most_loaned_materials(**pagination)

@router.get("/events-attendance")
def get_events_attendance(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_events_attendance(**pagination)

@router.get("/material-availability")
def get_material_availability(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_material_availability(**pagination)

@router.get("/top-donors")
def get_top_donors(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_top_donors(**pagination)

@router.get("/sanctions")
def get_sanctions(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_sanctions(**pagination)

@router.get("/overdue-loans")
def get_overdue_loans(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_overdue_loans(**pagination)
