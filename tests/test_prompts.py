from vslib.build import default_root
from vslib.prompts import reconstruction_prompt
from vslib.seed import materialize
from vslib.store import Library


def test_reconstruction_omits_low_weights_and_avoids_genre_words():
    lib = materialize(Library(default_root()))
    built = reconstruction_prompt(lib, "aes_soft_halated_shadow", "Keep this teapot.")
    prompt = built["prompt"].lower()
    assert "cinematic" not in prompt
    assert "1980s" not in prompt
    assert "vintage" not in prompt
    assert built["dominant"]
    assert all(abs(item["weight"]) >= 0.40 for item in built["dominant"] + built["supporting"])
