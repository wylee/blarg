Rails.application.routes.draw do
  root "articles#index"
  resources :articles, defaults: { format: :json }
end
