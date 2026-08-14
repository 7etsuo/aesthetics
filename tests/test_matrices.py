import numpy as np

from vslib.matrices import column_correlation, cooccurrence, cosine_sim, profile_distance, redundancy_pairs


def test_cooccurrence_shape():
    x = np.array([[1.0, 0.0], [0.5, 0.5]])
    c = cooccurrence(x)
    assert c.shape == (2, 2)
    assert abs(c[0, 0] - 1.25) < 1e-9


def test_cosine_identical():
    m = np.array([[1.0, 2.0], [1.0, 2.0]])
    s = cosine_sim(m, axis=1)
    assert abs(s[0, 1] - 1.0) < 1e-9


def test_redundancy_pairs():
    x = np.array([[0.1, 0.1], [0.8, 0.8], [0.4, 0.4]], dtype=float)
    corr = column_correlation(x)
    pairs = redundancy_pairs(["a", "b"], corr, threshold=0.99)
    assert pairs


def test_profile_distance():
    d = profile_distance({"vec_a": 1.0}, {"vec_a": 0.0, "vec_b": 1.0})
    assert d["euclidean"] > 0
    assert "cosine" in d
