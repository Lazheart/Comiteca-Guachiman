from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.loans import LoanRepository
from psycopg import Connection

router = APIRouter(prefix="/loans", tags=["Loans"])

@router.get("")
def get_loans(conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_all()

@router.get("/active")
def get_active_loans(conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_active()

@router.get("/expired")
def get_expired_loans(conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_expired()

@router.get("/member/{dni}")
def get_member_loans(dni: int, conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_by_member(dni)

@router.get("/material/{material_id}")
def get_material_loans(material_id: int, conn: Connection = Depends(get_db_connection)):
    repo = LoanRepository(conn)
    return repo.get_by_material(material_id)
