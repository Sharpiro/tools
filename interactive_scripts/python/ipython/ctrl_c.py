ipython = get_ipython()
key_bindings = ipython.pt_app.key_bindings
redraw_args = {"render_as_done": True}


@key_bindings.add("c-c")
def print_hello(event):
    text = event.cli.current_buffer.text.rstrip()
    event.cli.current_buffer.cursor_position = len(text)
    event.cli.current_buffer.text = text
    event.cli._redraw(**redraw_args)
    event.cli.reset()
    event.cli.current_buffer.reset()
