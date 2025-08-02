{
  description = "Astro dev environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: 
    let 
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
          pnpm
          nodePackages.prettier
          typescript-language-server
          vscode-langservers-extracted
          astro-language-server
          tailwindcss-language-server
          eslint
        ];
        shellHook = ''
          tmux
        '';
      };
    };
}
