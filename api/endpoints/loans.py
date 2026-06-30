from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.loans import LoanRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.get("")
def get_loans(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_all(**pagination)

@router.get("/active")
def get_active_loans(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_active(**pagination)

@router.get("/expired")
def get_expired_loans(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_expired(**pagination)

@router.get("/member/{dni}")
def get_member_loans(dni: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_by_member(dni, **pagination)

@router.get("/material/{material_id}")
def get_material_loans(material_id: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_by_material(material_id, **pagination)
