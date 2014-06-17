defmodule Iodized.Definition do

  defprotocol Rule do
    def matches?(definition, state)
  end

  ## All
  defmodule All do
    defstruct definitions: []
    defimpl Rule, for: All do
      def matches?(all, state) do
        Enum.all?(all.definitions, &Rule.matches?(&1, state))
      end
    end
  end


  ## Any
  defmodule Any do
    defstruct definitions: []
    defimpl Rule, for: Any do
      def matches?(any, state) do
        Enum.any?(any.definitions, &Rule.matches?(&1, state))
      end
    end
  end


  ## IncludedIn
  defmodule IncludedIn do
    defstruct actual_state_param_name: nil, allowed_values: []
    defimpl Rule, for: IncludedIn do
      def matches?(included_in, state) do
        actual_value = state[included_in.actual_state_param_name]
        Enum.member?(included_in.allowed_values, actual_value)
      end
    end
  end


  # Is
  defmodule Is do
    defstruct actual_state_param_name: nil, allowed_value: "true"
    defimpl Rule, for: Is do
      def matches?(is, state) do
        Dict.get(state, is.actual_state_param_name) == is.allowed_value
      end
    end
  end

  # Percentage
  defmodule Percentage do
    defstruct actual_state_param_name: nil, threshold: 0
    defimpl Rule, for: Percentage do
      @powers Enum.map(15..0, fn(x) -> :math.pow(16, x) |> trunc end)

      def digest_int(s) do
        md5 = :crypto.hash(:md5, s)
        Enum.zip(bitstring_to_list(md5), @powers) |> Enum.reduce(0, fn({byte, power}, acc) -> byte * power + acc end)
      end

      def matches?(percentage, state) do
        id = state[percentage.actual_state_param_name]
        value = digest_int(id) |> rem(100)
        value < percentage.threshold
      end
    end
  end


  # boolean/nil
  defimpl Rule, for: Atom do
    def matches?(bool, _state) when is_boolean(bool), do: bool
    def matches?(nil, _state), do: false
  end

  # function
  defimpl Rule, for: Function do
    def matches?(f, state), do: f.(state)
  end
end
