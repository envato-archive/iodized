%%
%% Autogenerated by Thrift Compiler (0.9.1)
%%
%% DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
%%

-module(features_thrift).
-behaviour(thrift_service).


-include("features_thrift.hrl").

-export([struct_info/1, function_info/2]).

struct_info('i am a dummy struct') -> undefined.
%%% interface
% ping(This)
function_info('ping', params_type) ->
  {struct, []}
;
function_info('ping', reply_type) ->
  string;
function_info('ping', exceptions) ->
  {struct, []}
;
% feature_set(This, State)
function_info('feature_set', params_type) ->
  {struct, [{1, {map, string, string}}]}
;
function_info('feature_set', reply_type) ->
  {map, string, bool};
function_info('feature_set', exceptions) ->
  {struct, []}
;
function_info(_Func, _Info) -> no_function.
