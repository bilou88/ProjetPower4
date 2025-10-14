package main

import (
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

var (
	tmplIndex = template.Must(template.ParseFiles(filepath.Join("templates", "index.html")))
	tmplPower = template.Must(template.ParseFiles(filepath.Join("templates", "power.html")))
)

func handlerIndex(w http.ResponseWriter, r *http.Request) {
	data := map[string]any{
		"Title": "MAPAMOBI — Accueil",
		"Body":  "Ceci est une page HTML générée avec Go.",
	}
	if err := tmplIndex.Execute(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func handlerPower(w http.ResponseWriter, r *http.Request) {
	data := map[string]any{
		"Title": "Power 4 — MAPAMOBI",
		"Body":  "Bienvenue sur MAPAMOBI !",
	}
	if err := tmplPower.Execute(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	// /static/ -> ./static
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// routes
	http.HandleFunc("/", handlerIndex)
	http.HandleFunc("/power", handlerPower)

	log.Println("Serveur démarré sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}