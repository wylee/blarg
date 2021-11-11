class ApplicationController < ActionController::API
  def render_by_content_type(data)
    if request.formats.include? 'application/json'
      render json: data
    end
  end
end
