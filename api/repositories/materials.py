from psycopg import Connection
from core.exceptions import NotFoundError

class MaterialRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, genre=None, author=None, country=None, available=None):
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
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        with self.conn.cursor() as cur:
            cur.execute(query, params)
            return cur.fetchall()

    def get_by_id(self, material_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Material WHERE id = %s", (material_id,))
            row = cur.fetchone()
            if not row:
                raise NotFoundError()
            return row

    def search(self, query: str):
        with self.conn.cursor() as cur:
            search_query = f"%{query}%"
            cur.execute("SELECT * FROM Material WHERE titulo ILIKE %s OR autor ILIKE %s", (search_query, search_query))
            return cur.fetchall()

    def get_copies(self, material_id: int):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM Ejemplar WHERE material_id = %s", (material_id,))
            return cur.fetchall()
