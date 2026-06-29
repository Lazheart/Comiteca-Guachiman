from fastapi import Query
from pydantic import BaseModel
from typing import Generic, TypeVar, List, Optional
import math
from psycopg import Connection

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total_items: int
    total_pages: int
    current_page: int
    page_size: int
    has_next: bool
    has_previous: bool

def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term"),
    sort_by: Optional[str] = Query(None, description="Field to sort by"),
    order: Optional[str] = Query("asc", regex="^(asc|desc)$", description="Sort order (asc or desc)")
):
    return {
        "page": page,
        "page_size": page_size,
        "search": search,
        "sort_by": sort_by,
        "order": order
    }

def execute_paginated_query(
    conn: Connection,
    base_query: str,
    params: list,
    page: int,
    page_size: int,
    sort_by: Optional[str] = None,
    order: str = "asc",
    allowed_sort_columns: list = None
) -> dict:
    # Get total count
    count_query = f"SELECT COUNT(*) FROM ({base_query}) AS count_subquery"
    with conn.cursor() as cur:
        cur.execute(count_query, params)
        total_items = cur.fetchone()["count"]

    # Calculate pagination
    total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
    if page > total_pages and total_items > 0:
        page = total_pages
        
    offset = (page - 1) * page_size

    # Build sorted/paginated query
    final_query = base_query
    
    if sort_by and allowed_sort_columns and sort_by in allowed_sort_columns:
        final_query += f" ORDER BY {sort_by} {'ASC' if order.lower() == 'asc' else 'DESC'}"
        
    final_query += " LIMIT %s OFFSET %s"
    final_params = list(params) + [page_size, offset]

    with conn.cursor() as cur:
        cur.execute(final_query, final_params)
        items = cur.fetchall()

    return {
        "items": items,
        "total_items": total_items,
        "total_pages": total_pages,
        "current_page": page,
        "page_size": page_size,
        "has_next": page < total_pages,
        "has_previous": page > 1
    }
