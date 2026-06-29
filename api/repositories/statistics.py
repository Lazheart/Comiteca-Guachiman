from psycopg import Connection
from core.pagination import execute_paginated_query

class StatisticsRepository:
    def __init__(self, conn: Connection):
        self.conn = conn

    def get_most_loaned_materials(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = """
            SELECT m.titulo, COUNT(p.id) as total_prestamos
            FROM Material m
            JOIN Prestamo p ON m.id = p.material_id
            GROUP BY m.titulo
        """
        if not sort_by: sort_by = "total_prestamos"; order = "desc"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_events_attendance(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = """
            SELECT e.tema, e.fecha, COUNT(a.visitante_DNI) as total_asistentes
            FROM Evento e
            LEFT JOIN Asistencia a ON e.id = a.evento_id
            GROUP BY e.id, e.tema, e.fecha
        """
        if not sort_by: sort_by = "total_asistentes"; order = "desc"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_material_availability(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = """
            SELECT m.titulo, e.disponibilidad, COUNT(*) as cantidad
            FROM Material m
            JOIN Ejemplar e ON m.id = e.material_id
            GROUP BY m.titulo, e.disponibilidad
        """
        if not sort_by: sort_by = "cantidad"; order = "desc"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_top_donors(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = """
            SELECT institucion_donante, SUM(ejemplares_donados) as total_ejemplares
            FROM vista_auditoria_donaciones
            GROUP BY institucion_donante
        """
        if not sort_by: sort_by = "total_ejemplares"; order = "desc"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_sanctions(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = """
            SELECT s.motivo, COUNT(*) as cantidad
            FROM Sancion s
            GROUP BY s.motivo
        """
        if not sort_by: sort_by = "cantidad"; order = "desc"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)

    def get_overdue_loans(self, page=1, page_size=20, search=None, sort_by=None, order='asc'):
        query = "SELECT * FROM vista_prestamos_alertas WHERE estado_tiempo_real = 'ALERTA: VENCIDO'"
        return execute_paginated_query(self.conn, query, [], page, page_size, sort_by, order)