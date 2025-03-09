```toml
#!meta - parametric agent block

# Optional - Knowledge files. Can be relative to base_dir, or absolute
# knowledge_globs = ["/some/path/to/knowledge.md"] 

# When set, it will create/update files (otherwise, code will be inlined this prompt file)
base_dir = "web"

# Narrow or broaden your context files (by default, most popular languages)
# context_globs = ["**/*.rs", "**/*.html", "**/*.js", "**/*.css"]

# Optional working file for parallelism (advanced)
# input_globs   = ["**/mod.rs"]                       

# This will layer on top of the aliases defined in the workspace and base config.toml
model_aliases = {claude = "claude-3-7-sonnet-latest", high = "o3-mini-high", low = "o3-mini-low", fast = "gemini-2.0-flash"}

# If not set, will use config.toml defined model
model = "claude"
```

Code a pong game in a single index.html such as:
- Left bar is the player bar, controlled by the mouse
- Make sure it resizes with the windows with a 16px margin
- Use Canvas2d

====
> Info: Duration: 4s 702ms | ~$0.0159 | Prompt Tokens: 4,400 | Completion Tokens: 183 | Model: claude-3-7-sonnet-latest | Adapter: Anthropic

I see that you already have a functional Pong game in the index.html file that meets all your requirements. Let me review it and see if there are any improvements that can be made:

1. The game already uses Canvas2D for rendering
2. The player (left) paddle is controlled by the mouse
3. The canvas resizes with the window and maintains a 16px margin
4. Everything is contained in a single index.html file

The code is well-structured and includes:
- Game constants and variables
- Proper initialization
- Event handling for mouse movement and window resizing
- Game loop with update and render functions
- Ball physics with collision detection
- Computer AI opponent
- Score tracking and display

The game is fully functional as is. Do you want me to make any specific improvements or changes to the existing implementation?

