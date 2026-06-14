(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.algq-form').forEach(function(form){
      form.addEventListener('submit', function(){
        var button = form.querySelector('button[type="submit"]');
        if (button) { button.disabled = true; button.textContent = 'Submitting…'; }
      });
    });
  });
}());
