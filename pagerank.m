function v = pagerank(H, k)
    % given an nxn matrix H with every entry (i,j) being how much weight
    % page j assigns to page i, pagerank(H) returns a vector containing
    % the importance ratings of each page. k is the number of iterations
    % to use when calculating the stationary vector of the Google matrix.
    
    if nargin == 1
        k = 100;
    end
    
    v = stationary(google(H), k)';
end
