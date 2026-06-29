from psycopg import Connection
from core.pagination import execute_paginated_query

class LoanRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Prestamo"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_active(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Prestamo WHERE fechaDevolucion IS NULL"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)
            
    def get_expired(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Prestamo WHERE fechaDevolucion IS NULL AND fechaLimite < CURRENT_DATE"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_by_member(self, dni: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Prestamo WHERE miembro_DNI = %s"
        return execute_paginated_query(self.conn, query, [dni], page, page_size, sort_by, order)
            
    def get_by_material(self, material_id: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM Prestamo WHERE material_id = %s"
        return execute_paginated_query(self.conn, query, [material_id], page, page_size, sort_by, order)