from psycopg import Connection
from core.pagination import execute_paginated_query

class DonationRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_all(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM vista_auditoria_donaciones"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_statistics(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    institucion_donante, 
                    SUM(ejemplares_donados) as total_ejemplares,
                    COUNT(*) as numero_donaciones
                FROM vista_auditoria_donaciones 
                GROUP BY institucion_donante
                ORDER BY total_ejemplares DESC
            """)
            return cur.fetchall()