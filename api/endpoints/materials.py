from fastapi import APIRouter, Depends, Query
from typing import Optional
from core.config import get_db_connection
from repositories.materials import MaterialRepository
from psycopg import Connection

router = APIRouter(prefix="/materials", tags=["Materials"])

@router.get("")
def get_materials(
    genre: Optional[str] = None, 
    author: Optional[str] = None, 
    country: Optional[str] = None, 
    available: Optional[bool] = None,
    conn: Connection = Depends(get_db_connection)
):
    repo = MaterialRepository(conn)
    return repo.get_all(genre, author, country, available)

@router.get("/search")
def search_materials(q: str = Query(...), conn: Connection = Depends(get_db_connection)):
    repo = MaterialRepository(conn)
    return repo.search(q)

@router.get("/{material_id}")
def get_material(material_id: int, conn: Connection = Depends(get_db_connection)):
    repo = MaterialRepository(conn)
    return repo.get_by_id(material_id)

@router.get("/{material_id}/copies")
def get_material_copies(material_id: int, conn: Connection = Depends(get_db_connection)):
    repo = MaterialRepository(conn)
    repo.get_by_id(material_id)
    return repo.get_copies(material_id)
