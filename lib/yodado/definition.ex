defmodule Yodado.Definition do

  defprotocol Rule do
    def matches?(definition, state)
  end

  ## All
  defrecord All,
    operand: "All",
    definitions: []

  defimpl Rule, for: All do
    def matches?(all, state) do
      Enum.all?(all.definitions, &Rule.matches?(&1, state))
    end
  end


  ## Any
  defrecord Any,
    operand: "Any",
    definitions: []

  defimpl Rule, for: Any do
    def matches?(any, state) do
      Enum.any?(any.definitions, &Rule.matches?(&1, state))
    end
  end


  ## IncludedIn
  defrecord IncludedIn,
    operand: "IncludedIn",
    actual_state_param_name: nil,
    allowed_values: []

  defimpl Rule, for: IncludedIn do
    def matches?(included_in, state) do
      actual_value = state[included_in.actual_state_param_name]
      Enum.member?(included_in.allowed_values, actual_value)
    end
  end


  # Is
  defrecord Is,
    operand: "Is",
    actual_state_param_name: nil,
    allowed_value: "true"

  defimpl Rule, for: Is do
    def matches?(is, state) do
      state[is.actual_state_param_name] == is.allowed_value
    end
  end


  # boolean
  defimpl Rule, for: Atom do
    def matches?(bool, _state) when is_boolean(bool), do: bool
  end


  # function
  defimpl Rule, for: Function do
    def matches?(f, state), do: f.(state)
  end
end
