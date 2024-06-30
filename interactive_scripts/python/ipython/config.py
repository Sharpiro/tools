c = get_config()  # noqa
c.TerminalIPythonApp.display_banner = False
# Seems good but unintuitive commas with "/ , ;" prefixes
c.InteractiveShell.autocall = 0
c.InteractiveShell.show_rewritten_input = True
c.TerminalInteractiveShell.auto_match = True
c.TerminalInteractiveShell.confirm_exit = False
c.TerminalInteractiveShell.editing_mode = "emacs"
