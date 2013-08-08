// Generated by CoffeeScript 1.6.2
(function() {
  var LittlesisApi, Netmap;

  LittlesisApi = (function() {
    function LittlesisApi(key) {
      this.key = key;
      this.base_url = "http://api.littlesis.org/";
    }

    LittlesisApi.prototype.entities_and_rels_url = function(entity_ids) {
      return this.base_url + "map/entities.json?entity_ids=" + entity_ids.join(",") + "&_key=" + this.key;
    };

    LittlesisApi.prototype.entities_and_rels = function(entity_ids, callback) {
      return $.ajax({
        url: this.entities_and_rels_url(entity_ids),
        success: callback,
        error: function() {
          return alert("There was an error retrieving data from the API");
        },
        dataType: "json"
      });
    };

    LittlesisApi.prototype.get_add_entity_data = function(entity_id, entity_ids, callback) {
      return $.ajax({
        url: this.base_url + "map/addEntityData.json",
        data: {
          "entity_id": entity_id,
          "entity_ids": entity_ids
        },
        success: callback,
        error: function() {
          return alert("There was an error retrieving data from the API");
        },
        type: "GET",
        dataType: "json"
      });
    };

    LittlesisApi.prototype.get_add_related_entities_data = function(entity_id, num, entity_ids, rel_ids, include_cats, callback) {
      if (include_cats == null) {
        include_cats = [];
      }
      return $.ajax({
        url: this.base_url + "map/addRelatedEntitiesData.json",
        data: {
          "entity_id": entity_id,
          "num": num,
          "entity_ids": entity_ids,
          "rel_ids": rel_ids,
          "include_cat_ids": include_cats
        },
        success: callback,
        error: function() {
          return alert("There was an error retrieving data from the API");
        },
        type: "GET",
        dataType: "json"
      });
    };

    LittlesisApi.prototype.search_entities = function(q, callback) {
      return $.ajax({
        url: this.base_url + "map/searchEntities.json",
        data: {
          "q": q
        },
        success: callback,
        error: function() {
          return alert("There was an error retrieving data from the API");
        },
        type: "GET",
        dataType: "json"
      });
    };

    LittlesisApi.prototype.create_map = function(width, height, user_id, out_data, callback) {
      return $.ajax({
        url: this.base_url + "map.json",
        data: {
          "width": width,
          "height": height,
          "user_id": user_id,
          "data": JSON.stringify(out_data)
        },
        success: callback,
        error: function() {
          return alert("There was an error sending data to the API");
        },
        type: "POST",
        dataType: "json"
      });
    };

    LittlesisApi.prototype.get_map = function(id, callback) {
      return $.ajax({
        url: this.base_url + ("map/" + id + ".json"),
        success: callback,
        error: function() {
          return alert("There was an error retrieving data from the API");
        },
        dataType: "json"
      });
    };

    LittlesisApi.prototype.update_map = function(id, width, height, out_data, callback) {
      return $.ajax({
        url: this.base_url + ("map/" + id + "/update.json"),
        data: {
          "width": width,
          "height": height,
          "data": JSON.stringify(out_data)
        },
        success: callback,
        error: function() {
          return alert("There was an error sending data to the API");
        },
        type: "POST",
        dataType: "json"
      });
    };

    return LittlesisApi;

  })();

  Netmap = (function() {
    function Netmap(width, height, parent_selector, key) {
      this.width = width;
      this.height = height;
      this.parent_selector = parent_selector;
      this.init_svg();
      this.force_enabled = false;
      this.entity_background_opacity = 0.6;
      this.entity_background_color = "#fff";
      this.entity_background_corner_radius = 5;
      this.distance = 225;
      this.api = new LittlesisApi(key);
      this.init_callbacks();
    }

    Netmap.prototype.init_svg = function() {
      var zoom, zoom_func;

      this.svg = d3.select(this.parent_selector).append("svg").attr("id", "svg").attr("width", this.width).attr("height", this.height);
      zoom = this.svg.append('g').attr("id", "zoom").attr("fill", "#ffe");
      this.zoom = d3.behavior.zoom();
      this.zoom.scaleExtent([0.5, 5]);
      zoom_func = function() {
        var scale, trans;

        trans = d3.event.translate;
        scale = d3.event.scale;
        return zoom.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
      };
      this.svg.call(this.zoom.on("zoom", zoom_func));
      return zoom.append('rect').attr("id", "bg").attr('width', this.width).attr('height', this.height).attr('fill', 'white');
    };

    Netmap.prototype.zoom_by = function(scale) {
      var x_diff, y_diff;

      x_diff = (scale - 1) * this.width;
      y_diff = (scale - 1) * this.height;
      this.zoom.scale(this.zoom.scale() * scale);
      this.zoom.translate([this.zoom.translate()[0] - x_diff / 2, this.zoom.translate()[1] - y_diff / 2]);
      return d3.select("#zoom").attr("transform", "translate(" + this.zoom.translate() + ") scale(" + this.zoom.scale() + ")");
    };

    Netmap.prototype.reset_zoom = function() {
      this.zoom.scale(1);
      this.zoom.translate([0, 0]);
      return d3.selectAll("#zoom").attr("transform", "translate(0, 0) scale(1)");
    };

    Netmap.prototype.init_callbacks = function() {
      var t;

      t = this;
      $(window).on("mousemove", function(e) {
        t.mouse_x = e.pageX;
        return t.mouse_y = e.pageY;
      });
      return $(document).on("keydown", function(e) {
        var d, rebuild, selected, _i, _j, _len, _len1, _ref, _ref1;

        switch (e.keyCode) {
          case 8:
          case 46:
          case 68:
          case 100:
            rebuild = false;
            selected = $(".selected").length > 0;
            _ref = d3.selectAll($(".rel.selected")).data();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              d = _ref[_i];
              t.remove_rel(d.id);
              rebuild = true;
            }
            _ref1 = d3.selectAll($(".entity.selected")).data();
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              d = _ref1[_j];
              t.remove_entity(d.id);
              rebuild = true;
            }
            if (rebuild) {
              t.build();
            }
            if (selected) {
              return e.preventDefault();
            }
            break;
          case 65:
          case 97:
            if ($("#svg:hover").length > 0) {
              return t.toggle_add_entity_form();
            }
        }
      });
    };

    Netmap.prototype.toggle_add_entity_form = function() {
      var form;

      form = $("#netmap_add_entity");
      $(this.parent_selector).append(form);
      form.css("left", this.mouse_x - $(this.parent_selector).offset().left - 30 + "px");
      form.css("top", this.mouse_y - $(this.parent_selector).offset().top - 60 + "px");
      return form.css("display", form.css("display") === "none" ? "block" : "none");
    };

    Netmap.prototype.toggle_add_related_entities_form = function(entity_id) {
      var entity, form;

      entity = this.entity_by_id(entity_id);
      form = $("#netmap_add_related_entities");
      $(this.parent_selector).append(form);
      $("#netmap_add_related_entities_entity_id").val(entity_id);
      form.css("left", entity.x + this.zoom.translate()[0] + 40 + "px");
      form.css("top", entity.y + this.zoom.translate()[1] - 30 + "px");
      return form.css("display", form.css("display") === "none" ? "block" : "none");
    };

    Netmap.prototype.set_data = function(data, center_entity_id) {
      var e, entity_index, i, r, _i, _j, _len, _len1, _ref, _ref1, _results;

      if (center_entity_id == null) {
        center_entity_id = null;
      }
      this._original_data = {
        "entities": data.entities.slice(0),
        "rels": data.rels.slice(0)
      };
      this._data = data;
      if (center_entity_id != null) {
        this.set_center_entity_id(center_entity_id);
      }
      entity_index = [];
      _ref = this._data.entities;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        e.id = Number(e.id);
        if (e.px == null) {
          e.px = e.x;
        }
        if (e.py == null) {
          e.py = e.y;
        }
        entity_index[Number(e.id)] = i;
      }
      _ref1 = this._data.rels;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        r = _ref1[_j];
        r.id = Number(r.id);
        r.entity1_id = Number(r.entity1_id);
        r.entity2_id = Number(r.entity2_id);
        r.category_id = Number(r.category_id);
        if ((r.category_ids != null) && typeof r.category_ids === "string") {
          r.category_ids = r.category_ids.split(",");
        }
        if (r.category_ids instanceof Array) {
          r.category_ids = r.category_ids.map(Number);
        }
        r.is_current = Number(r.is_current);
        r.source = this._data.entities[entity_index[Number(r.entity1_id)]];
        _results.push(r.target = this._data.entities[entity_index[Number(r.entity2_id)]]);
      }
      return _results;
    };

    Netmap.prototype.data = function() {
      return this._data;
    };

    Netmap.prototype.entity_ids = function() {
      return this._data.entities.map(function(e) {
        return Number(e.id);
      });
    };

    Netmap.prototype.entities = function() {
      return this._data.entities;
    };

    Netmap.prototype.rel_ids = function() {
      return this._data.rels.map(function(r) {
        return Number(r.id);
      });
    };

    Netmap.prototype.rels = function() {
      return this._data.rels;
    };

    Netmap.prototype.set_user_id = function(user_id) {
      return this.user_id = user_id;
    };

    Netmap.prototype.set_network_map_id = function(id) {
      return this.network_map_id = id;
    };

    Netmap.prototype.get_network_map_id = function() {
      return this.network_map_id;
    };

    Netmap.prototype.save_map = function(callback) {
      if (callback == null) {
        callback = null;
      }
      this.remove_hidden_rels();
      if (this.network_map_id != null) {
        return this.update_map(callback);
      } else {
        return this.create_map(callback);
      }
    };

    Netmap.prototype.api_data_callback = function(callback, redirect) {
      var t;

      if (callback == null) {
        callback = null;
      }
      if (redirect == null) {
        redirect = false;
      }
      t = this;
      return function(data) {
        t.network_map_id = data.id;
        t.set_data(data.data);
        t.build();
        if (callback != null) {
          callback.call(t, data.id);
        }
        if (redirect) {
          return window.location.href = "http://littlesis.org/map/" + t.network_map_id;
        }
      };
    };

    Netmap.prototype.create_map = function(callback) {
      var t;

      if (callback == null) {
        callback = null;
      }
      t = this;
      return this.api.create_map(this.width, this.height, this.user_id, this._data, this.api_data_callback(callback, true));
    };

    Netmap.prototype.load_map = function(id, callback) {
      var t;

      if (callback == null) {
        callback = null;
      }
      this.network_map_id = id;
      t = this;
      return this.api.get_map(id, this.api_data_callback(callback));
    };

    Netmap.prototype.reload_map = function() {
      if (this.network_map_id != null) {
        return this.load_map(this.network_map_id);
      } else {
        this.set_data(this._original_data);
        this.build();
        return this.wheel();
      }
    };

    Netmap.prototype.update_map = function(callback) {
      var t;

      if (callback == null) {
        callback = null;
      }
      if (this.network_map_id == null) {
        return;
      }
      t = this;
      return this.api.update_map(this.network_map_id, this.width, this.height, this._data, this.api_data_callback(callback));
    };

    Netmap.prototype.data_for_save = function() {
      return {
        "width": this.width,
        "height": this.height,
        "user_id": this.user_id,
        "data": JSON.stringify(this._data)
      };
    };

    Netmap.prototype.search_entities = function(q, callback) {
      if (callback == null) {
        callback = null;
      }
      return this.api.search_entities(q, callback);
    };

    Netmap.prototype.add_entity = function(id, position) {
      var t;

      if (position == null) {
        position = null;
      }
      if (this.entity_ids().indexOf(parseInt(id)) > -1) {
        return false;
      }
      t = this;
      return this.api.get_add_entity_data(id, this.entity_ids(), function(data) {
        var new_data;

        data.entities = data.entities.map(function(e) {
          e.x = position != null ? position[0] : t.width / 2 + 200 * (0.5 - Math.random());
          e.y = position != null ? position[1] : t.height / 2 + 200 * (0.5 - Math.random());
          return e;
        });
        new_data = {
          "entities": t.data().entities.concat(data.entities),
          "rels": t.data().rels.concat(data.rels)
        };
        t.set_data(new_data);
        return t.build();
      });
    };

    Netmap.prototype.add_related_entities = function(entity_id, num, include_cats) {
      var entity, t;

      if (num == null) {
        num = 10;
      }
      if (include_cats == null) {
        include_cats = [];
      }
      entity = this.entity_by_id(entity_id);
      if (entity == null) {
        return false;
      }
      t = this;
      this.api.get_add_related_entities_data(entity_id, num, this.entity_ids(), this.rel_ids(), include_cats, function(data) {
        data.entities = t.circle_entities_around_point(data.entities, [entity.x, entity.y]);
        t.set_data({
          "entities": t.data().entities.concat(data.entities),
          "rels": t.data().rels.concat(data.rels)
        });
        return t.build();
      });
      return true;
    };

    Netmap.prototype.move_entities_inbounds = function() {
      var e, _i, _len, _ref, _results;

      _ref = this._data.entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.x < 70) {
          e.x = 70;
        }
        if (e.x > this.width) {
          e.x = this.width;
        }
        if (e.y < 50) {
          e.y = 50;
        }
        if (e.y > this.height) {
          _results.push(e.y = this.height);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Netmap.prototype.circle_entities_around_point = function(entities, position, radius) {
      var angle, e, i, _i, _len;

      if (radius == null) {
        radius = 150;
      }
      for (i = _i = 0, _len = entities.length; _i < _len; i = ++_i) {
        e = entities[i];
        angle = i * ((2 * Math.PI) / entities.length);
        e.x = position[0] + radius * Math.cos(angle);
        e.y = position[1] + radius * Math.sin(angle);
      }
      return entities;
    };

    Netmap.prototype.prune = function() {
      var e, _i, _len, _ref;

      this.remove_hidden_rels();
      _ref = this.unconnected_entities();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        this.remove_entity(e.id);
      }
      return this.build();
    };

    Netmap.prototype.show_all_rels = function() {
      var rel, _i, _len, _ref;

      _ref = this._data.rels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rel = _ref[_i];
        delete rel["hidden"];
      }
      return this.build();
    };

    Netmap.prototype.limit_to_cats = function(cat_ids) {
      var rel, _i, _len, _ref;

      _ref = this._data.rels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rel = _ref[_i];
        if (rel.category_ids != null) {
          if (rel.category_ids.filter(function(id) {
            return cat_ids.indexOf(Number(id)) > -1;
          }).length > 0) {
            rel.hidden = false;
          } else {
            rel.hidden = true;
          }
        } else {
          rel.hidden = cat_ids.indexOf(Number(rel.category_id)) === -1;
        }
      }
      return this.build();
    };

    Netmap.prototype.limit_to_current = function() {
      var rel, _i, _len, _ref;

      _ref = this._data.rels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rel = _ref[_i];
        if (rel.is_current === 1) {
          rel.hidden = false;
        } else {
          rel.hidden = true;
        }
      }
      return this.build();
    };

    Netmap.prototype.remove_hidden_rels = function() {
      this._data.rels = this._data.rels.filter(function(r) {
        return !r.hidden;
      });
      return this.build();
    };

    Netmap.prototype.unconnected_entities = function() {
      var connected_ids, r, _i, _len, _ref;

      connected_ids = [];
      _ref = this._data.rels;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        connected_ids.push(parseInt(r.entity1_id));
        connected_ids.push(parseInt(r.entity2_id));
      }
      return this._data.entities.filter(function(e) {
        return connected_ids.indexOf(parseInt(e.id)) === -1;
      });
    };

    Netmap.prototype.rel_index = function(id) {
      var i, r, _i, _len, _ref;

      _ref = this._data.rels;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        r = _ref[i];
        if (parseInt(r.id) === parseInt(id)) {
          return i;
        }
      }
    };

    Netmap.prototype.rel_by_id = function(id) {
      var i, r, _i, _len, _ref;

      _ref = this._data.rels;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        r = _ref[i];
        if (parseInt(r.id) === parseInt(id)) {
          return r;
        }
      }
    };

    Netmap.prototype.remove_rel = function(id) {
      return this._data.rels.splice(this.rel_index(id), 1);
    };

    Netmap.prototype.entity_index = function(id) {
      var e, i, _i, _len, _ref;

      _ref = this._data.entities;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        if (parseInt(e.id) === parseInt(id)) {
          return i;
        }
      }
    };

    Netmap.prototype.entity_by_id = function(id) {
      var e, i, _i, _len, _ref;

      _ref = this._data.entities;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        if (parseInt(e.id) === parseInt(id)) {
          return e;
        }
      }
      return null;
    };

    Netmap.prototype.remove_entity = function(id) {
      this._data.entities.splice(this.entity_index(id), 1);
      return this.remove_orphaned_rels();
    };

    Netmap.prototype.rels_by_entity = function(id) {
      return this._data.rels.filter(function(r) {
        return parseInt(r.entity1_id) === parseInt(id) || parseInt(r.entity2_id) === parseInt(id);
      });
    };

    Netmap.prototype.set_center_entity_id = function(id) {
      var entity, _i, _len, _ref, _results;

      this.center_entity_id = id;
      _ref = this._data["entities"];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (entity.id === this.center_entity_id) {
          entity.fixed = true;
          entity.x = this.width / 2;
          _results.push(entity.y = this.height / 2);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Netmap.prototype.wheel = function(center_entity_id) {
      var angle, count, entity, i, _i, _len, _ref;

      if (center_entity_id == null) {
        center_entity_id = null;
      }
      if (this.center_entity_id != null) {
        center_entity_id = this.center_entity_id;
      }
      if (center_entity_id != null) {
        return this.halfwheel(center_entity_id);
      }
      count = 0;
      _ref = this._data["entities"];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        entity = _ref[i];
        if (parseInt(entity.id) === center_entity_id) {
          this._data["entities"][i].x = this.width / 2;
          this._data["entities"][i].y = this.height / 2;
        } else {
          angle = (2 * Math.PI / (this._data["entities"].length - (center_entity_id != null ? 1 : 0))) * count;
          this._data["entities"][i].x = this.width / 2 + this.distance * Math.cos(angle);
          this._data["entities"][i].y = this.height / 2 + this.distance * Math.sin(angle);
          count++;
        }
      }
      return this.update_positions();
    };

    Netmap.prototype.halfwheel = function(center_entity_id) {
      var angle, count, entity, i, range, _i, _len, _ref;

      if (center_entity_id == null) {
        center_entity_id = null;
      }
      if (this.center_entity_id != null) {
        center_entity_id = this.center_entity_id;
      }
      if (center_entity_id == null) {
        return;
      }
      count = 0;
      _ref = this._data["entities"];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        entity = _ref[i];
        if (parseInt(entity.id) === center_entity_id) {
          this._data["entities"][i].x = this.width / 2;
          this._data["entities"][i].y = 30;
        } else {
          range = Math.PI * 2 / 3;
          angle = Math.PI + (Math.PI / (this._data["entities"].length - 2)) * count;
          this._data["entities"][i].x = 70 + (this.width - 140) / 2 + ((this.width - 140) / 2) * Math.cos(angle);
          this._data["entities"][i].y = 30 - ((this.width - 140) / 2) * Math.sin(angle);
          count++;
        }
      }
      return this.update_positions();
    };

    Netmap.prototype.grid = function() {
      var area, i, j, k, num, per, radius, x_num, y_num, _i, _j, _ref, _ref1;

      num = this._data.entities.length;
      area = this.width * this.height;
      per = (area / num) * 0.7;
      radius = Math.floor(Math.sqrt(per));
      x_num = Math.ceil(this.width / (radius * 1.25));
      y_num = Math.ceil(this.height / (radius * 1.25));
      for (i = _i = 0, _ref = x_num - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        for (j = _j = 0, _ref1 = y_num - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
          k = x_num * j + i;
          if (this._data.entities[k] != null) {
            this._data.entities[k].x = i * radius + 70 + (50 - 50 * Math.random());
            this._data.entities[k].y = j * radius + 30 + (50 - 50 * Math.random());
          }
        }
      }
      return this.update_positions();
    };

    Netmap.prototype.interlocks = function(degree0_id, degree1_ids, degree2_ids) {
      var angle, d0, d1, d2, i, id, radius, range, _i, _j, _len, _len1;

      d0 = this.entity_by_id(degree0_id);
      d0.x = this.width / 2;
      d0.y = 30;
      for (i = _i = 0, _len = degree1_ids.length; _i < _len; i = ++_i) {
        id = degree1_ids[i];
        range = Math.PI * 1 / 2;
        angle = (Math.PI * 3 / 2) + i * (range / (degree1_ids.length - 1)) - range / 2;
        radius = (this.width - 100) / 2;
        d1 = this.entity_by_id(id);
        d1.x = 70 + i * (this.width - 140) / (degree1_ids.length - 1);
        d1.y = this.height / 2 + 250 + radius * Math.sin(angle);
      }
      for (i = _j = 0, _len1 = degree2_ids.length; _j < _len1; i = ++_j) {
        id = degree2_ids[i];
        range = Math.PI * 1 / 3;
        angle = (Math.PI * 3 / 2) + i * (range / (degree2_ids.length - 1)) - range / 2;
        radius = (this.width - 100) / 2;
        d2 = this.entity_by_id(id);
        d2.x = 70 + i * (this.width - 140) / (degree2_ids.length - 1);
        d2.y = this.height - 480 - radius * Math.sin(angle);
      }
      return this.update_positions();
    };

    Netmap.prototype.shuffle_array = function(array) {
      var counter, index, temp;

      counter = array.length;
      while (counter--) {
        index = (Math.random() * counter) | 0;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }
      return array;
    };

    Netmap.prototype.shuffle = function() {
      var i, p, positions, _i, _len;

      positions = this.entities().map(function(e) {
        return [e.x, e.y];
      });
      positions = this.shuffle_array(positions);
      for (i = _i = 0, _len = positions.length; _i < _len; i = ++_i) {
        p = positions[i];
        this.entities()[i].x = p[0];
        this.entities()[i].y = p[1];
      }
      return this.update_positions();
    };

    Netmap.prototype.has_positions = function() {
      var e, r, _i, _j, _len, _len1, _ref, _ref1;

      _ref = this._data.entities;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (!((e.x != null) && (e.y != null))) {
          return false;
        }
      }
      _ref1 = this._data.rels;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        r = _ref1[_j];
        if (!((r.source.x != null) && (r.source.y != null) && (r.target.x != null) && (r.target.y != null))) {
          return false;
        }
      }
      return true;
    };

    Netmap.prototype.update_positions = function() {
      d3.selectAll(".entity").attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
      d3.selectAll(".rel").attr("transform", function(d) {
        return "translate(" + (d.source.x + d.target.x) / 2 + "," + (d.source.y + d.target.y) / 2 + ")";
      });
      d3.selectAll(".line").attr("x1", function(d) {
        return d.source.x - (d.source.x + d.target.x) / 2;
      }).attr("y1", function(d) {
        return d.source.y - (d.source.y + d.target.y) / 2;
      }).attr("x2", function(d) {
        return d.target.x - (d.source.x + d.target.x) / 2;
      }).attr("y2", function(d) {
        return d.target.y - (d.source.y + d.target.y) / 2;
      });
      return d3.selectAll(".rel text").attr("transform", function(d) {
        var angle, x_delta, y_delta;

        x_delta = d.target.x - d.source.x;
        y_delta = d.target.y - d.source.y;
        angle = Math.atan2(y_delta, x_delta) * 180 / Math.PI;
        if (d.source.x >= d.target.x) {
          angle += 180;
        }
        return "rotate(" + angle + ")";
      });
    };

    Netmap.prototype.use_force = function() {
      var e, i, t, _i, _len, _ref;

      _ref = this._data.entities;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        e = _ref[i];
        delete this._data.entities[i]["fixed"];
      }
      this.force_enabled = true;
      this.force = d3.layout.force().gravity(.3).distance(this.distance).charge(-5000).friction(0.7).size([this.width, this.height]).nodes(this._data.entities, function(d) {
        return d.id;
      }).links(this._data.rels, function(d) {
        return d.id;
      }).start();
      t = this;
      this.force.on("tick", function() {
        return t.update_positions();
      });
      if ((this.alpha != null) && this.alpha > 0) {
        return this.force.alpha(this.alpha);
      }
    };

    Netmap.prototype.one_time_force = function() {
      var t;

      if (this.force_enabled) {
        this.deny_force();
      }
      this.use_force();
      this.force.alpha(0.3);
      t = this;
      return this.force.on("end", function() {
        return t.force_enabled = false;
      });
    };

    Netmap.prototype.deny_force = function() {
      this.force_enabled = false;
      this.alpha = this.force.alpha();
      return this.force.stop();
    };

    Netmap.prototype.n_force_ticks = function(n) {
      var _i;

      this.use_force();
      for (_i = 1; 1 <= n ? _i <= n : _i >= n; 1 <= n ? _i++ : _i--) {
        this.force.tick();
      }
      return this.deny_force();
    };

    Netmap.prototype.build = function() {
      this.build_rels();
      this.build_entities();
      this.entities_on_top();
      if (this.has_positions()) {
        return this.update_positions();
      }
    };

    Netmap.prototype.remove_orphaned_rels = function() {
      var entity_ids, i, id, rel, rel_ids, _i, _len, _results;

      entity_ids = this._data.entities.map(function(e) {
        return e.id;
      });
      rel_ids = (function() {
        var _i, _len, _ref, _results;

        _ref = this._data.rels;
        _results = [];
        for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
          rel = _ref[i];
          if (entity_ids.indexOf(rel.entity1_id) === -1 || entity_ids.indexOf(rel.entity2_id) === -1) {
            _results.push(rel.id);
          }
        }
        return _results;
      }).call(this);
      _results = [];
      for (_i = 0, _len = rel_ids.length; _i < _len; _i++) {
        id = rel_ids[_i];
        _results.push(this.remove_rel(id));
      }
      return _results;
    };

    Netmap.prototype.build_rels = function() {
      var groups, rels, t, zoom;

      t = this;
      zoom = d3.select("#zoom");
      rels = zoom.selectAll(".rel").data(this._data["rels"], function(d) {
        return d.id;
      });
      groups = rels.enter().append("g").attr("class", "rel").attr("id", function(d) {
        return d.id;
      });
      groups.append("line").attr("class", "line").attr("opacity", 0.6).style("stroke-width", function(d) {
        return Math.sqrt(d.value) * 12;
      });
      groups.append("a").attr("xrel:href", function(d) {
        return d.url;
      }).append("text").attr("dy", function(d) {
        return Math.sqrt(d.value) * 10 / 2 - 1;
      }).attr("text-anchor", "middle").text(function(d) {
        return d.label;
      });
      rels.exit().remove();
      rels.style("display", function(d) {
        if (d.hidden === true) {
          return "none";
        } else {
          return null;
        }
      });
      this.svg.selectAll(".rel .line").data(this._data["rels"], function(d) {
        return d.id;
      });
      this.svg.selectAll(".rel a").data(this._data["rels"], function(d) {
        return d.id;
      }).on("click", function(d) {
        return window.location.href = d.url;
      });
      this.svg.selectAll(".rel text").data(this._data["rels"], function(d) {
        return d.id;
      });
      return this.svg.selectAll(".rel").on("click", function(d, i) {
        return t.toggle_selected_rel(d.id);
      });
    };

    Netmap.prototype.toggle_selected_rel = function(id, value) {
      var klass, rel;

      if (value == null) {
        value = null;
      }
      rel = $("#" + id + ".rel");
      if (value != null) {
        klass = value ? "rel selected" : "rel";
      } else {
        klass = rel.attr("class") === "rel" ? "rel selected" : "rel";
      }
      return rel.attr("class", klass);
    };

    Netmap.prototype.build_entities = function() {
      var buttons, entities, entity_drag, groups, has_image, links, t, zoom;

      t = this;
      zoom = d3.selectAll("#zoom");
      entity_drag = d3.behavior.drag().on("dragstart", function(d, i) {
        if (t.force_enabled) {
          t.alpha = t.force.alpha();
        }
        if (t.force_enabled) {
          t.force.stop();
        }
        t.drag = false;
        d3.event.sourceEvent.preventDefault();
        return d3.event.sourceEvent.stopPropagation();
      }).on("drag", function(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        t.update_positions();
        return t.drag = true;
      }).on("dragend", function(d, i) {
        d.fixed = true;
        if (t.force_enabled) {
          return t.force.alpha(t.alpha);
        }
      });
      entities = zoom.selectAll(".entity").data(this._data["entities"], function(d) {
        return d.id;
      });
      groups = entities.enter().append("g").attr("class", "entity").attr("id", function(d) {
        return d.id;
      }).call(entity_drag);
      has_image = function(d) {
        return d.image.indexOf("anon") === -1;
      };
      groups.append("rect").attr("class", "image_rect").attr("fill", this.entity_background_color).attr("opacity", 1).attr("width", 58).attr("height", 58).attr("x", -29).attr("y", -29).attr("stroke", "#f8f8f8").attr("stroke-width", 1);
      groups.append("image").attr("class", "image").attr("opacity", function(d) {
        if (has_image(d)) {
          return 1;
        } else {
          return 0.5;
        }
      }).attr("xlink:href", function(d) {
        return d.image;
      }).attr("x", -25).attr("y", -25).attr("width", 50).attr("height", 50);
      buttons = groups.append("a").attr("class", "add_button");
      buttons.append("text").attr("dx", 30).attr("dy", -20).text("+").on("click", function(d) {
        return t.toggle_add_related_entities_form(d.id);
      });
      groups.insert("rect", ":first-child").attr("class", "add_button_rect").attr("x", 29).attr("y", -29).attr("fill", this.entity_background_color).attr("opacity", this.entity_background_opacity).attr("width", 10).attr("height", 10);
      links = groups.append("a").attr("class", "entity_link").attr("xlink:href", function(d) {
        return d.url;
      }).attr("title", function(d) {
        return d.description;
      });
      links.append("text").attr("dx", 0).attr("dy", 40).attr("text-anchor", "middle").text(function(d) {
        return t.split_name(d.name)[0];
      });
      links.append("text").attr("dx", 0).attr("dy", 55).attr("text-anchor", "middle").text(function(d) {
        return t.split_name(d.name)[1];
      });
      groups.filter(function(d) {
        return t.split_name(d.name)[0] !== d.name;
      }).insert("rect", ":first-child").attr("fill", this.entity_background_color).attr("opacity", this.entity_background_opacity).attr("rx", this.entity_background_corner_radius).attr("ry", this.entity_background_corner_radius).attr("x", function(d) {
        return -$(this.parentNode).find(".entity_link text:nth-child(2)").width() / 2 - 3;
      }).attr("y", function(d) {
        var extra_offset, image_offset, text_offset;

        image_offset = $(this.parentNode).find("image").attr("height") / 2;
        text_offset = $(this.parentNode).find(".entity_link text").height();
        extra_offset = 2;
        return image_offset + text_offset + extra_offset;
      }).attr("width", function(d) {
        return $(this.parentNode).find(".entity_link text:nth-child(2)").width() + 6;
      }).attr("height", function(d) {
        return $(this.parentNode).find(".entity_link text:nth-child(2)").height() + 4;
      });
      groups.insert("rect", ":first-child").attr("fill", this.entity_background_color).attr("opacity", this.entity_background_opacity).attr("rx", this.entity_background_corner_radius).attr("ry", this.entity_background_corner_radius).attr("x", function(d) {
        return -$(this.parentNode).find(".entity_link text").width() / 2 - 3;
      }).attr("y", function(d) {
        var extra_offset, image_offset;

        image_offset = $(this.parentNode).find("image").attr("height") / 2;
        extra_offset = 1;
        return image_offset + extra_offset;
      }).attr("width", function(d) {
        return $(this.parentNode).find(".entity_link text").width() + 6;
      }).attr("height", function(d) {
        return $(this.parentNode).find(".entity_link text").height() + 4;
      });
      entities.exit().remove();
      this.svg.selectAll(".entity").on("click", function(d, i) {
        if (!t.drag) {
          return t.toggle_selected_entity(d.id);
        }
      });
      return this.svg.selectAll(".entity a").on("click", function(d, i) {
        return d3.event.stopPropagation();
      });
    };

    Netmap.prototype.toggle_selected_entity = function(id) {
      var g, klass, r, selected, _i, _len, _ref, _results;

      g = $("#" + id + ".entity");
      klass = g.attr("class") === "entity" ? "entity selected" : "entity";
      g.attr("class", klass);
      selected = g.attr("class") === "entity selected";
      _ref = this.rels_by_entity(id);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        r = _ref[_i];
        _results.push(this.toggle_selected_rel(r.id, selected));
      }
      return _results;
    };

    Netmap.prototype.entities_on_top = function() {
      var zoom;

      zoom = $("#zoom");
      $("g.rel").each(function(i, g) {
        return $(g).prependTo(zoom);
      });
      return $("#bg").prependTo(zoom);
    };

    Netmap.prototype.split_name = function(name, min_length) {
      var half, i, parts;

      if (min_length == null) {
        min_length = 16;
      }
      if (name == null) {
        return ["", ""];
      }
      name = name.trim();
      if (name.length < min_length) {
        return [name, ""];
      }
      i = name.indexOf(" ", Math.floor(name.length * 1 / 2));
      if (i > -1 && i <= Math.floor(name.length * 2 / 3)) {
        return [name.substring(0, i), name.substring(i + 1)];
      } else {
        i = name.lastIndexOf(" ", Math.ceil(name.length / 2));
        if (i >= Math.floor(name.lenth * 1 / 3)) {
          return [name.substring(0, i), name.substring(i + 1)];
        }
      }
      parts = name.split(/\s+/);
      half = Math.ceil(parts.length / 2);
      return [parts.slice(0, half).join(" "), parts.slice(half).join(" ")];
    };

    return Netmap;

  })();

  if (typeof module !== "undefined" && module.exports) {
    exports.Netmap = Netmap;
  } else {
    window.Netmap = Netmap;
  }

}).call(this);
