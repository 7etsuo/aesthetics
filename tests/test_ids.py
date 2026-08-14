from vslib.ids import interaction_id, mint_id, next_observation_id, slugify, validate_id


def test_vector_id():
    assert mint_id("vec", "Optical Softness") == "vec_optical_softness"
    assert validate_id("vec_optical_softness") == "vector"


def test_leading_digit_slug():
    assert slugify("1980s fantasy") == "n_1980s_fantasy"
    assert mint_id("alias", "80s fantasy") == "alias_n_80s_fantasy"


def test_observation_counter():
    assert next_observation_id([]) == "obs_0001"
    assert next_observation_id(["obs_0001", "obs_0012"]) == "obs_0013"


def test_interaction_id_is_sorted():
    assert interaction_id("vec_halation", "vec_optical_softness") == interaction_id(
        "vec_optical_softness", "vec_halation"
    )
    assert validate_id(interaction_id("vec_halation", "vec_optical_softness")) == "interaction"
