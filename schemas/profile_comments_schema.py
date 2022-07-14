from pydantic.main import BaseModel


class ProfileBase(BaseModel):
    text: str
    user_id: int
