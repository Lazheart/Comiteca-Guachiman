from fastapi import APIRouter, Depends
from core.config import get_db_connection
from repositories.copies import CopyRepository
from psycopg import Connection
from core.pagination import get_pagination_params

router = APIRouter(prefix="/copies", tags=["Copies"])

@router.get("")
def get_copies(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_all(**pagination)

@router.get("/available")
def get_available_copies(pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_available(**pagination)

@router.get("/{material_id}")
def get_copies_by_material(material_id: int, pagination: dict = Depends(get_pagination_params), conn: Connection = Depends(get_db_connection)):
    repo = CopyRepository(conn)
    return repo.get_by_material(material_id, **pagination)
