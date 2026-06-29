from psycopg import Connection
from core.exceptions import NotFoundError
from core.pagination import execute_paginated_query

class MaterialRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, genre=None, author=None, country=None, available=None, page=1, page_size=20, search=None, sort_by=None, order="asc"):
        query = "SELECT DISTINCT m.* FROM Material m"
        params = []
        conditions = []
        
        if available is not None:
            query += " JOIN Ejemplar e ON m.id = e.material_id"
            if available:
                conditions.append("e.disponibilidad = 'Disponible'")
            else:
                conditions.append("e.disponibilidad != 'Disponible'")
                
        if genre:
            conditions.append("m.genero = %s")
            params.append(genre)
        if author:
            conditions.append("m.autor = %s")
            params.append(author)
        if country:
            conditions.append("m.paisOrigen = %s")
            params.append(country)
            
        if search:
            search_term = f"%{search}%"
            conditions.append("(m.titulo ILIKE %s OR m.autor ILIKE %s)")
            params.extend([search_term, search_term])
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        return execute_paginated_query(
            self.conn, 
            query, 
            params, 
            page, 
            page_size, 
            sort_by, 
            order,
            allowed_sort_columns=["titulo", "autor", "fechaPublicacion"]
        )

    def get_by_id(self, material_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Material WHERE id = %s", (material_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def get_copies(self, material_id: int, page=1, page_size=20, search=None, sort_by=None, order="asc"):
        query = "SELECT * FROM Ejemplar WHERE material_id = %s"
        params = [material_id]
        
        return execute_paginated_query(
            self.conn, 
            query, 
            params, 
            page, 
            page_size, 
            sort_by, 
            order,
            allowed_sort_columns=["estado", "disponibilidad"]
        )
