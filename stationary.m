function I = stationary(H, k)
	[n, ~] = size(H);
	I = zeros(n, 1);
	I(1,1) = 1;
	for i=1:k;
		I = H * I;
	end
end
