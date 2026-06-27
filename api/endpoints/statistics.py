from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.statistics import StatisticsRepository
from psycopg import Connection

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("/most-loaned-materials")
def get_most_loaned_materials(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_most_loaned_materials()

@router.get("/events-attendance")
def get_events_attendance(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_events_attendance()

@router.get("/material-availability")
def get_material_availability(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_material_availability()

@router.get("/top-donors")
def get_top_donors(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_top_donors()

@router.get("/sanctions")
def get_sanctions(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_sanctions()

@router.get("/overdue-loans")
def get_overdue_loans(conn: Connection = Depends(get_db_connection)):
    repo = StatisticsRepository(conn)
    return repo.get_overdue_loans()
