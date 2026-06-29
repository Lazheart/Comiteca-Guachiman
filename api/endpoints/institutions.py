from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.institutions import InstitutionRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.get("")
def get_institutions(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    return repo.get_all(**pagination)

@router.get("/{institution_id}")
def get_institution(institution_id: int, conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    return repo.get_by_id(institution_id)

@router.get("/{institution_id}/donations")
def get_institution_donations(institution_id: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    repo.get_by_id(institution_id)
    return repo.get_donations(institution_id, **pagination)

@router.get("/{institution_id}/sponsored-events")
def get_institution_sponsored_events(institution_id: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = InstitutionRepository(conn)
    repo.get_by_id(institution_id)
    return repo.get_sponsored_events(institution_id, **pagination)
