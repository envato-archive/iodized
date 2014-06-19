namespace erl Iodized
namespace rb Iodized

service Features {
  string ping(),

  map<string,bool> feature_set(1:map<string,string> state)

}
