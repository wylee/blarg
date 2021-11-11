class ArticlesController < ApplicationController
  def index
    @articles = Article.all
    render_by_content_type(@articles)
  end

  def show
    @article = Article.find(params[:id])
    render_by_content_type(@article)
  end

  def create
    @article = Article.new(article_params)
    @article.save
    render_by_content_type(@article)
  end

  def update
    @article = Article.find(params[:id])
    @article.update! article_params
    render_by_content_type(@article)
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy
    render_by_content_type(@article)
  end

  private

  def article_params
    params.require(:article).permit(:title, :author, :body)
  end
end
