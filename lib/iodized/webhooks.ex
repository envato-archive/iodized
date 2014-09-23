defmodule Iodized.Webhooks do

  defstruct update_feature_hooks: nil, add_feature_hooks: nil, delete_feature_hooks: nil

  def from_json(json) do

    update_feature_hooks = Dict.fetch!(json, :update_feature_hooks)
    add_feature_hooks = Dict.fetch!(json, :add_feature_hooks)
    delete_feature_hooks = Dict.fetch!(json, :delete_feature_hooks)

    %Iodized.Webhooks{ update_feature_hooks: update_feature_hooks,
                       add_feature_hooks: add_feature_hooks,
                       delete_feature_hooks: delete_feature_hooks }
  end

end
