function G = make_irreducible(S)
    % Sergey Brin and Larry Page chose alpha=0.85 for good results while
    % not making rate of converge of the power method (see stationary.m)
    % too slow.
    alpha = 0.85;
    [n, ~] = size(S);
    I = ones(n);
    G = alpha * S + (1 - alpha)/n * I;
end
