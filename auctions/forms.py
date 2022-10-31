from socket import fromshare
from django import forms
from .models import category

class newListingForm(forms.Form):
    title = forms.CharField(label="", widget=forms.TextInput(attrs={'placeholder': 'Name of listing...', "class": "my-2", "style": "width:80%"}))
    description = forms.CharField(label="", widget=forms.Textarea(attrs={'placeholder': 'Description of item...', "class": "my-2", "style": "width:80%"}))
    url = forms.CharField(label="", widget=forms.TextInput(attrs={'placeholder': 'Image URL (optional)', "class": "my-2", "style": "width:80%"}), required=False)
    price = forms.DecimalField(label="", widget=forms.NumberInput(attrs={'placeholder': 'Price...', "class": "my-2", "style": "width:30%"}))
    category = forms.ModelChoiceField(queryset=category.objects.all(), label="", widget=forms.Select(attrs={"class": "my-2", "style": "width:30%"}), required=False)

class commentForm(forms.Form):
    comment = forms.CharField(label="", widget=forms.Textarea(attrs={'placeholder': 'Leave a comment...', "style": "width:100%;height:100px"}))

class bidForm(forms.Form):
    bidAmount = forms.DecimalField(label="", widget=forms.NumberInput(attrs={'placeholder': 'Enter bid ammount...', "class": "my-2", "style": "height:40px"}))
