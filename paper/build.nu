def build-pdf [] {
    typst compile ./main.typ
}

def build-docx [] {
    pandoc ./main.typ -o paper.docx
}
