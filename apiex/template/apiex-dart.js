const buildCombine = ({ types, interfaces }) => `
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Customer your error
void onError(String err) {
  print(err);
}

// Customer your baseOptions
var options = BaseOptions(
  baseUrl: "/",
  connectTimeout: 5000,
  receiveTimeout: 3000,
);

Dio dio = Dio(options);

String? authorization;

Future<void> initAuthorization() async {
  Future<SharedPreferences> _prefs = SharedPreferences.getInstance();
  SharedPreferences prefs = await _prefs;
  authorization = prefs.getString("Authorization");
}

Future<Options> getOptions() async {
  if (authorization == null) {
    await initAuthorization();
  }
  return Options(
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization,
    },
  );
}

Future<Map<String, dynamic>?> fetchGet(
    String url, Map<String, dynamic>? query) async {
  try {
    var res = await dio.get(
      url,
      queryParameters: query,
      options: await getOptions(),
    );
    return res.data;
  } on DioError catch (e) {
    if (e.response != null) {
      onError(e.response!.data);
    } else {
      onError(e.message);
    }
  }
}

Future<Map<String, dynamic>?> fetchPost(
    String url, Map<String, dynamic>? body) async {
  try {
    var res = await dio.post(
      url,
      data: body,
      options: await getOptions(),
    );
    return res.data;
  } on DioError catch (e) {
    if (e.response != null) {
      onError(e.response!.data);
    } else {
      onError(e.message);
    }
  }
}

Future<Map<String, dynamic>?> fetchPut(
    String url, Map<String, dynamic> body) async {
  try {
    var res = await dio.put(
      url,
      data: body,
      options: await getOptions(),
    );
    return res.data;
  } on DioError catch (e) {
    if (e.response != null) {
      onError(e.response!.data);
    } else {
      onError(e.message);
    }
  }
}

Future<Map<String, dynamic>?> fetchDelete(
    String url, Map<String, dynamic>? body) async {
  try {
    var res = await dio.delete(
      url,
      data: body,
      options: await getOptions(),
    );
    return res.data;
  } on DioError catch (e) {
    if (e.response != null) {
      onError(e.response!.data);
    } else {
      onError(e.message);
    }
  }
}
${types}
${interfaces}
`;

const buildType = ({ upperName, name, fields }) => {
  const items = fields.map((item) => {
    return `${item.type} ${item.name};`;
  });
  const itemsInit = fields.map((item) => {
    return `this.${item.name},`;
  });
  const itemsToMap = fields.map((item) => {
    return `'${item.name}': ${item.name},`;
  });
  const itemsToJson = fields.map((item) => {
    return `${item.name}: map['${item.name}'],`;
  });
  return `
class ${upperName} {
  ${items.join("\n  ")}
  ${upperName}({
    ${itemsInit.join("\n    ")}
  });

  Map<String, dynamic> toMap() {
    return {
      ${itemsToMap.join("\n      ")}
    };
  }

  factory ${upperName} .fromMap(Map<String, dynamic> map) {
    return ${upperName} (
      ${itemsToJson.join("\n      ")}
    );
  }

  String toJson() => json.encode(toMap());

  factory ${upperName}.fromJson(String source) => ${upperName}.fromMap(json.decode(source));
}
  `;
};

const buildInterface = ({ upperName, name, fields, capUpperCase }) => {
  const items = fields.map((item) => {
    if (item.input) {
      return `
static Future<${item.type.name}> ${item.name}(${item.input} input) async {
  var res = await fetch${capUpperCase(item.opts.method)}("${
        item.opts.url
      }", input.toMap());
  return ${item.type.name}.fromMap(res!);
}`;
    } else {
      return `
static Future<${item.type.name}> ${item.name}() async {
  var res = await fetch${capUpperCase(item.opts.method)}("${
        item.opts.url
      }", null);
  return ${item.type.name}.fromMap(res!);
}`;
    }
    const input = item.input ? `${item.input} input` : "";
  });

  return `
class ${upperName} {
  ${items.join("\n  ")}
}
`;
};

module.exports = {
  type: "dart",
  buildType,
  buildInterface,
  buildCombine,
};
