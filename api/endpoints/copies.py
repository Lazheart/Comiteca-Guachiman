from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.copies import CopyRepository
from psycopg import Connection

router = APIRouter(prefix="/copies", tags=["Copies"])

@router.get("")
def get_copies(conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_all()

@router.get("/available")
def get_available_copies(conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_available()

@router.get("/{material_id}")
def get_copies_by_material(material_id: int, conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_by_material(material_id)
