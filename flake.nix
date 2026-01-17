{
  description = "talesign/talesign.com";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [ ];

        shellHook = ''
          if [ -z "$TMUX" ]; then
            tmux set-option -g default-command "nix develop --command zsh"
            tmux new-session -s talesign -d 'nvim' \; new-window
            tmux attach-session -t talesign
          fi
        '';
      };
    };
}
