from django.shortcuts import render, redirect
from . import util
from markdown2 import Markdown
from random import choice
from django import forms

m_down = Markdown()

class editEntry(forms.Form):
    new_title = forms.CharField(label="", widget=forms.TextInput)
    new_content = forms.CharField(label="", widget=forms.Textarea)
    new_content.widget.attrs.update({'class': 'textarea'})

class newEntry(forms.Form):
    new_title = forms.CharField(label="", widget=forms.TextInput(attrs={'placeholder': 'Title...'}))
    new_content = forms.CharField(label="", widget=forms.Textarea(attrs={'placeholder': 'Type your entry here...'}))
    new_content.widget.attrs.update({'class': 'textarea'})

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def get_page(request,title):

    entry = util.get_entry(title)

    if entry is None:
        return render(request, "encyclopedia/not_found.html") 

    html = m_down.convert(entry)
    return render(request,"encyclopedia/titlepage.html",{
        'title': title, 
        'body': html
    })

def page_search(request):
    key = request.POST.get("q", "")
    entries = util.list_entries()

    results = []

    for entry in entries:
        if key.lower() in entry.lower():
            results.append(entry)

    if len(results)==1:
        return redirect('title', title=results[0])
    elif len(results)>1:
            return render(request, "encyclopedia/search_results.html", {
                "results": results,
                "len": len(results)
            })
    else:
        return render(request, "encyclopedia/not_found.html") 

def create_new_page(request):
    return render(request, "encyclopedia/create_new_page.html", {
        'form': newEntry()
    }) 

def add_entry(request):
        new_title = request.POST.get("new_title", "")
        new_content = request.POST.get("new_content", "")
        entries = util.list_entries()
        for entry in entries:
            if new_title.lower() in entry.lower():
                return render(request, "encyclopedia/error.html", {
                   "title": "Sorry!",
                   "content": "It looks like that entry already exsists."
               })

        util.save_entry(new_title, new_content)
        return redirect('title', title=new_title)

def random(request):
    entries = util.list_entries()   
    return redirect('title', choice(entries))

def edit_entry(request, title):

    entry = util.get_entry(title)

    if entry is None:
        return render(request, "encyclopedia/not_found.html") 

    return render(request,"encyclopedia/edit_page.html",{
        'form': editEntry({'new_title': title, 'new_content': entry}),
        'title': title, 
        'body': entry
    })

def save_edit(request):
    if request.method == "POST":
        form = editEntry(request.POST)
        if form.is_valid():
            new_title = form.cleaned_data["new_title"]
            new_content = form.cleaned_data["new_content"]
            util.save_entry(new_title, bytes(new_content, 'utf8'))
            return redirect('title', title=new_title)

