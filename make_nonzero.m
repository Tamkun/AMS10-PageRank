function S = make_nonzero(H)
    % ensures all columns in H are non-zero. zero columns are replaced with a
	% column of identical entries summing to 1.
    S = H;
	[n, ~] = size(H);
	zerocol = zeros(n, 1);
	for c=1:n
		if isequal(S(:, c), zerocol)
			S(:, c) = S(:, c) + 1 / n;
		end
    end
end
