function G = google(H)
    % creates a Google matrix from H: modifies the matrix to ensure the
    % matrix is primitive and irreducible.
    G = make_irreducible(make_nonzero(H));
end
