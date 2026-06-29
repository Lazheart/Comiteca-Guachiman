from psycopg import Connection
from core.pagination import execute_paginated_query

class ReservationRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM ReservaGestionada"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_pending(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM ReservaGestionada WHERE estadoReserva = 'Pendiente'"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_by_member(self, dni: int, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM ReservaGestionada WHERE miembro_DNI = %s"
        return execute_paginated_query(self.conn, query, [dni], page, page_size, sort_by, order)