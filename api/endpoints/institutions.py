from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.institutions import InstitutionRepository
from psycopg import Connection

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.get("")
def get_institutions(conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    return repo.get_all()

@router.get("/{institution_id}")
def get_institution(institution_id: int, conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    return repo.get_by_id(institution_id)

@router.get("/{institution_id}/donations")
def get_institution_donations(institution_id: int, conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    repo.get_by_id(institution_id)
    return repo.get_donations(institution_id)

@router.get("/{institution_id}/sponsored-events")
def get_institution_sponsored_events(institution_id: int, conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    repo.get_by_id(institution_id)
    return repo.get_sponsored_events(institution_id)
