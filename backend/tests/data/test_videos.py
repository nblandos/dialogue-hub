import pytest

from src.data.videos import get_videos_by_category, menu_videos, training_videos


@pytest.mark.parametrize("category,expected", [
    ("menu", menu_videos),
    ("training", training_videos),
])
def test_get_videos_by_category_valid(category, expected):
    result = get_videos_by_category(category)
    assert result == expected
    assert isinstance(result, list)
    assert all(isinstance(item, dict) and "name" in item for item in result)


def test_get_videos_by_category_invalid():
    with pytest.raises(ValueError, match=r"Invalid category: invalid_category"):
        get_videos_by_category("invalid_category")
