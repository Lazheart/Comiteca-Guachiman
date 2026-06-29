from psycopg import Connection
from core.pagination import execute_paginated_query

class CopyRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Ejemplar"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_available(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Ejemplar WHERE disponibilidad = 'Disponible'"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)
        
    def get_by_material(self, material_id: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Ejemplar WHERE material_id = %s"
        return execute_paginated_query(self.conn, query, [material_id], page, page_size, sort_by, order)