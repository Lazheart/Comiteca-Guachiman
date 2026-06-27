from fastapi import Request
from fastapi.responses import JSONResponse

class NotFoundError(Exception):
    pass

class InvalidRequestError(Exception):
    pass

def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"error": "Resource not found"})

def invalid_request_handler(request: Request, exc: InvalidRequestError):
    return JSONResponse(status_code=400, content={"error": "Invalid request"})

def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": "Internal server error"})
