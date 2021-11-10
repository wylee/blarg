class Article < ApplicationRecord
  default_scope { order(created_at: :desc) }
  validates :title, presence: true
  validates :author, presence: true
  validates :body, presence: true, length: { minimum: 1 }
end
